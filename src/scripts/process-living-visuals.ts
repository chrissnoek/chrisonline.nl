type VisualKind = 'design' | 'develop' | 'maintain';

type UniformValue = number | number[];

type LivingMount = {
  dispose: () => void;
  setSpeed: (speed?: number) => void;
  setUniforms: (uniforms: Record<string, UniformValue>) => void;
};

type PointerState = {
  x: number;
  y: number;
  force: number;
};

type VisualSpec = {
  shader: string;
  uniforms: Record<string, UniformValue>;
  speed: number;
  frame: number;
};

const VERTEX_SHADER = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const DESIGN_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_energy;
uniform vec4 u_back;
uniform vec4 u_light;
uniform vec4 u_orange;
uniform vec4 u_deep;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x), f.y);
}

void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  vec2 pointer = vec2(u_pointer.x, -u_pointer.y) * vec2(0.74, 0.56);
  float phase = u_time * 0.46;
  float influence = exp(-2.8 * pow(p.x - pointer.x, 2.0)) * u_energy;

  float axis = 0.20 * sin(p.x * 2.25 + phase)
             + 0.07 * sin(p.x * 5.1 - phase * 0.65);
  axis += influence * (pointer.y - axis) * 0.72;
  float thickness = 0.17
                  + 0.045 * sin(p.x * 1.7 - phase)
                  + 0.022 * (noise(p * 4.1 + phase * 0.2) - 0.5);
  float distanceToFold = abs(p.y - axis);
  float ends = 1.0 - smoothstep(1.02, 1.38, abs(p.x));
  float body = (1.0 - smoothstep(thickness - 0.018, thickness + 0.035, distanceToFold)) * ends;
  float innerFold = (1.0 - smoothstep(0.018, 0.055, abs(distanceToFold - thickness * 0.46))) * body;
  float edgeLight = (1.0 - smoothstep(0.012, 0.045, abs(distanceToFold - thickness * 0.92))) * body;
  float grain = noise(p * 9.0 + vec2(phase * 0.17, 0.0));
  float glow = exp(-7.5 * distanceToFold) * ends * (0.12 + 0.12 * u_energy);

  vec3 material = mix(u_deep.rgb, u_orange.rgb, clamp(0.32 + p.y * 0.55 + grain * 0.22, 0.0, 1.0));
  material = mix(material, u_light.rgb, innerFold * 0.72 + edgeLight * 0.6);
  vec3 color = mix(u_back.rgb, material, body);
  color += u_orange.rgb * glow;
  fragColor = vec4(color, 1.0);
}`;

const DEVELOP_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_energy;
uniform vec4 u_back;
uniform vec4 u_light;
uniform vec4 u_orange;
uniform vec4 u_deep;

out vec4 fragColor;

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  vec2 pointer = vec2(u_pointer.x, -u_pointer.y) * vec2(0.78, 0.58);
  float pull = exp(-3.4 * dot(uv - pointer, uv - pointer)) * u_energy;
  vec2 p = (uv - (pointer - uv) * pull * 0.14) * 3.05;
  vec2 cell = floor(p);
  vec2 local = fract(p);
  float nearest = 10.0;
  float second = 10.0;
  vec2 nearestVector = vec2(0.0);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 random = hash22(cell + neighbor);
      vec2 animated = 0.5 + 0.34 * sin(u_time * 0.34 + 6.2831 * random);
      vec2 delta = neighbor + animated - local;
      float distanceSquared = dot(delta, delta);
      if (distanceSquared < nearest) {
        second = nearest;
        nearest = distanceSquared;
        nearestVector = delta;
      } else if (distanceSquared < second) {
        second = distanceSquared;
      }
    }
  }

  float nearestDistance = sqrt(nearest);
  float edge = 1.0 - smoothstep(0.025 + pull * 0.012, 0.085 + pull * 0.02, sqrt(second) - nearestDistance);
  float node = 1.0 - smoothstep(0.055, 0.13 + pull * 0.025, nearestDistance);
  float halo = exp(-18.0 * dot(uv - pointer, uv - pointer)) * u_energy;
  float flow = 0.5 + 0.5 * sin(u_time * 0.55 + nearestVector.x * 5.0 - nearestVector.y * 4.0);

  vec3 network = mix(u_deep.rgb, u_orange.rgb, flow);
  network = mix(network, u_light.rgb, node * 0.88 + halo * 0.42);
  float ink = clamp(edge * 0.78 + node + halo * 0.32, 0.0, 1.0);
  vec3 color = mix(u_back.rgb, network, ink);
  fragColor = vec4(color, 1.0);
}`;

const MAINTAIN_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_energy;
uniform vec4 u_back;
uniform vec4 u_light;
uniform vec4 u_orange;
uniform vec4 u_deep;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0)), f.x), f.y);
}

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  vec2 pointer = vec2(u_pointer.x, -u_pointer.y) * vec2(0.7, 0.52);
  vec2 center = pointer * 0.12 * u_energy;
  vec2 p = uv - center;
  p.x *= 0.9;
  float angle = atan(p.y, p.x);
  float radius = length(p);
  float breathing = 0.035 * sin(u_time * 0.34);
  float repair = 0.045 * sin(angle * 3.0 - u_time * 0.28)
               + 0.026 * (noise(vec2(angle * 1.35, u_time * 0.09)) - 0.5);
  float pointerWave = exp(-5.5 * dot(uv - pointer, uv - pointer)) * u_energy * 0.11;
  float ringRadius = 0.55 + breathing + repair + pointerWave;
  float distanceToRing = abs(radius - ringRadius);
  float ring = 1.0 - smoothstep(0.038, 0.085 + u_energy * 0.012, distanceToRing);
  float highlight = 1.0 - smoothstep(0.008, 0.026, abs(distanceToRing - 0.038));

  vec2 p2 = uv - vec2(-0.12, 0.07);
  p2 *= mat2(cos(0.32), -sin(0.32), sin(0.32), cos(0.32));
  p2.x *= 1.22;
  float secondRing = 1.0 - smoothstep(0.025, 0.06, abs(length(p2) - 0.39 - 0.022 * sin(u_time * 0.27)));
  secondRing *= 0.5 + 0.5 * smoothstep(-0.7, 0.45, p2.y);
  float glow = exp(-6.0 * distanceToRing) * 0.24;

  vec3 material = mix(u_deep.rgb, u_orange.rgb, 0.58 + 0.42 * sin(angle + u_time * 0.2));
  material = mix(material, u_light.rgb, highlight * 0.75 + secondRing * 0.34);
  float ink = clamp(ring + secondRing * 0.72, 0.0, 1.0);
  vec3 color = mix(u_back.rgb, material, ink);
  color += u_orange.rgb * glow;
  fragColor = vec4(color, 1.0);
}`;

function hexColor(value: string) {
  const hex = value.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
    1,
  ];
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function prefersReducedData() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

function createSpec(kind: VisualKind): VisualSpec {
  const material = {
    u_pointer: [0, 0],
    u_energy: 0,
    u_back: hexColor('#111114'),
    u_light: hexColor('#ffd0a6'),
    u_orange: hexColor('#f05a2c'),
    u_deep: hexColor('#8f210f'),
  };

  if (kind === 'develop') {
    return {
      shader: DEVELOP_SHADER,
      speed: 0.22,
      frame: 1150,
      uniforms: material,
    };
  }

  if (kind === 'maintain') {
    return {
      shader: MAINTAIN_SHADER,
      speed: 0.16,
      frame: 2380,
      uniforms: material,
    };
  }

  return {
    shader: DESIGN_SHADER,
    speed: 0.18,
    frame: 540,
    uniforms: material,
  };
}

class WebGLMount implements LivingMount {
  private canvas = document.createElement('canvas');
  private context: WebGL2RenderingContext;
  private program: WebGLProgram;
  private uniformLocations = new Map<string, WebGLUniformLocation | null>();
  private resizeObserver: ResizeObserver;
  private animationFrame = 0;
  private previousTime = 0;
  private elapsed: number;
  private speed: number;
  private disposed = false;

  constructor(
    private host: HTMLElement,
    fragmentShader: string,
    initialUniforms: Record<string, UniformValue>,
    speed: number,
    frame: number,
  ) {
    const context = this.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!context) throw new Error('WebGL2 wordt niet ondersteund');
    this.context = context;
    this.program = this.createProgram(VERTEX_SHADER, fragmentShader);
    this.elapsed = frame / 1000;
    this.speed = speed;
    this.host.prepend(this.canvas);

    const buffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      context.STATIC_DRAW,
    );
    context.enableVertexAttribArray(0);
    context.vertexAttribPointer(0, 2, context.FLOAT, false, 0, 0);
    context.useProgram(this.program);
    this.setUniforms(initialUniforms);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.host);
    this.resize();
    this.setSpeed(speed);
  }

  private compileShader(type: number, source: string) {
    const shader = this.context.createShader(type);
    if (!shader) throw new Error('WebGL-shader kon niet worden aangemaakt');
    this.context.shaderSource(shader, source);
    this.context.compileShader(shader);
    if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
      const error = this.context.getShaderInfoLog(shader);
      this.context.deleteShader(shader);
      throw new Error(error || 'WebGL-shader kon niet worden gecompileerd');
    }
    return shader;
  }

  private createProgram(vertexSource: string, fragmentSource: string) {
    const vertex = this.compileShader(this.context.VERTEX_SHADER, vertexSource);
    const fragment = this.compileShader(this.context.FRAGMENT_SHADER, fragmentSource);
    const program = this.context.createProgram();
    if (!program) throw new Error('WebGL-programma kon niet worden aangemaakt');
    this.context.attachShader(program, vertex);
    this.context.attachShader(program, fragment);
    this.context.linkProgram(program);
    this.context.deleteShader(vertex);
    this.context.deleteShader(fragment);
    if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
      const error = this.context.getProgramInfoLog(program);
      this.context.deleteProgram(program);
      throw new Error(error || 'WebGL-programma kon niet worden gekoppeld');
    }
    return program;
  }

  private getUniform(name: string) {
    if (!this.uniformLocations.has(name)) {
      this.uniformLocations.set(name, this.context.getUniformLocation(this.program, name));
    }
    return this.uniformLocations.get(name) ?? null;
  }

  private resize() {
    const bounds = this.host.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      Math.sqrt(1_500_000 / (bounds.width * bounds.height)),
    );
    const width = Math.max(1, Math.round(bounds.width * pixelRatio));
    const height = Math.max(1, Math.round(bounds.height * pixelRatio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.context.viewport(0, 0, width, height);
      const resolution = this.getUniform('u_resolution');
      if (resolution) this.context.uniform2f(resolution, width, height);
      this.render();
    }
  }

  private render = () => {
    if (this.disposed) return;
    this.context.useProgram(this.program);
    const time = this.getUniform('u_time');
    if (time) this.context.uniform1f(time, this.elapsed);
    this.context.drawArrays(this.context.TRIANGLES, 0, 6);
  };

  private tick = (time: number) => {
    if (this.disposed || this.speed === 0) {
      this.animationFrame = 0;
      return;
    }
    if (this.previousTime) this.elapsed += ((time - this.previousTime) / 1000) * this.speed;
    this.previousTime = time;
    this.render();
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  setUniforms(uniforms: Record<string, UniformValue>) {
    this.context.useProgram(this.program);
    Object.entries(uniforms).forEach(([name, value]) => {
      const location = this.getUniform(name);
      if (!location) return;
      if (Array.isArray(value)) {
        if (value.length === 2) this.context.uniform2fv(location, value);
        if (value.length === 3) this.context.uniform3fv(location, value);
        if (value.length === 4) this.context.uniform4fv(location, value);
      } else {
        this.context.uniform1f(location, value);
      }
    });
    this.render();
  }

  setSpeed(speed = 1) {
    this.speed = speed;
    this.previousTime = 0;
    if (speed !== 0 && !this.animationFrame) this.animationFrame = requestAnimationFrame(this.tick);
    if (speed === 0 && this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.context.deleteProgram(this.program);
    this.context.getExtension('WEBGL_lose_context')?.loseContext();
    this.canvas.remove();
  }
}

function applyInteraction(mount: LivingMount, state: PointerState) {
  const { x, y, force } = state;
  mount.setUniforms({
    u_pointer: [x, y],
    u_energy: force,
  });
}

function connectInteraction(element: HTMLButtonElement, mount: LivingMount, signal: AbortSignal) {
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  let current: PointerState = { x: 0, y: 0, force: 0 };
  let target: PointerState = { ...current };
  let animationFrame = 0;
  let resetTimer = 0;
  let tapDirection = 1;

  const renderInteraction = () => {
    current = {
      x: current.x + (target.x - current.x) * 0.09,
      y: current.y + (target.y - current.y) * 0.09,
      force: current.force + (target.force - current.force) * 0.08,
    };
    applyInteraction(mount, current);

    const distance =
      Math.abs(target.x - current.x) +
      Math.abs(target.y - current.y) +
      Math.abs(target.force - current.force);
    if (distance > 0.002) animationFrame = requestAnimationFrame(renderInteraction);
    else animationFrame = 0;
  };

  const moveTo = (next: PointerState) => {
    target = next;
    if (!animationFrame) animationFrame = requestAnimationFrame(renderInteraction);
  };

  const pointFromEvent = (event: PointerEvent) => {
    const bounds = element.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
    };
  };

  const pulse = (x: number, y: number) => {
    window.clearTimeout(resetTimer);
    moveTo({ x, y, force: 1 });
    resetTimer = window.setTimeout(() => moveTo({ x: 0, y: 0, force: 0 }), 560);
  };

  element.addEventListener(
    'pointermove',
    (event) => {
      if (coarsePointer || event.pointerType === 'touch') return;
      const point = pointFromEvent(event);
      element.dataset.response = 'pointer';
      moveTo({ ...point, force: 0.72 });
    },
    { signal, passive: true },
  );

  element.addEventListener(
    'pointerleave',
    () => {
      if (!coarsePointer) moveTo({ x: 0, y: 0, force: 0 });
    },
    { signal },
  );

  element.addEventListener(
    'pointerdown',
    (event) => {
      if (!coarsePointer && event.pointerType !== 'touch') return;
      const point = pointFromEvent(event);
      element.dataset.response = 'touch';
      pulse(point.x, point.y);
    },
    { signal, passive: true },
  );

  element.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      tapDirection *= -1;
      element.dataset.response = 'keyboard';
      pulse(0.62 * tapDirection, -0.28 * tapDirection);
    },
    { signal },
  );

  signal.addEventListener(
    'abort',
    () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(resetTimer);
    },
    { once: true },
  );
}

export function initProcessLivingVisuals(root: ParentNode = document) {
  const elements = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-living-visual]'));
  if (!elements.length) return () => undefined;

  const abort = new AbortController();
  const mounts = new Map<HTMLButtonElement, { mount: LivingMount; speed: number }>();
  const visible = new WeakMap<HTMLButtonElement, boolean>();
  const canAnimate = !prefersReducedMotion() && !prefersReducedData();

  if (!canAnimate) {
    elements.forEach((element) => (element.dataset.engine = 'static'));
    return () => abort.abort();
  }

  const start = async (element: HTMLButtonElement) => {
    if (mounts.has(element) || element.dataset.engine === 'loading') return;
    const kind = element.dataset.livingVisual as VisualKind | undefined;
    const host = element.querySelector<HTMLElement>('[data-visual-host]');
    if (!kind || !host) return;

    element.dataset.engine = 'loading';
    try {
      if (abort.signal.aborted || !element.isConnected) return;
      const spec = createSpec(kind);
      const mount = new WebGLMount(
        host,
        spec.shader,
        spec.uniforms,
        visible.get(element) === false ? 0 : spec.speed,
        spec.frame,
      );
      mounts.set(element, { mount, speed: spec.speed });
      connectInteraction(element, mount, abort.signal);
      requestAnimationFrame(() => {
        host.dataset.ready = 'true';
        element.dataset.engine = 'webgl';
      });
    } catch (error) {
      element.dataset.engine = 'static';
      element.dataset.visualError = error instanceof Error ? error.message : 'Onbekende shaderfout';
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLButtonElement;
        const isVisible = entry.isIntersecting;
        visible.set(element, isVisible);
        if (isVisible) void start(element);
        const controller = mounts.get(element);
        controller?.mount.setSpeed(isVisible ? controller.speed : 0);
      });
    },
    { rootMargin: '45% 0px 45% 0px', threshold: 0.01 },
  );

  elements.forEach((element) => observer.observe(element));

  return () => {
    abort.abort();
    observer.disconnect();
    mounts.forEach(({ mount }) => mount.dispose());
    mounts.clear();
  };
}
