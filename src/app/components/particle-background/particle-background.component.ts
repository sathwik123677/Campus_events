import { Component, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-particle-background',
  standalone: true,
  template: `
    <canvas #particleCanvas class="particle-canvas"></canvas>
  `,
  styles: [`
    .particle-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }
  `]
})
export class ParticleBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private animationId!: number;
  private mouseX = 0;
  private mouseY = 0;
  private isBrowser = false;
  private currentTheme = 'dark';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
      if (this.particles) {
        this.updateParticleColors();
      }
    });

    this.initThree();
    this.animate();
    this.addEventListeners();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.createParticles();
  }

  private createParticles() {
    const particleCount = window.innerWidth < 768 ? 500 : 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color(0xD4AF37);
    const whiteColor = new THREE.Color(0xEDEDED);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;

      const color = Math.random() > 0.5 ? goldColor : whiteColor;
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: this.currentTheme === 'dark' ? 0.15 : 0.1,
      vertexColors: true,
      transparent: true,
      opacity: this.currentTheme === 'dark' ? 0.8 : 0.6,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private updateParticleColors() {
    const material = this.particles.material as THREE.PointsMaterial;
    material.size = this.currentTheme === 'dark' ? 0.15 : 0.1;
    material.opacity = this.currentTheme === 'dark' ? 0.8 : 0.6;
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.particles) {
      this.particles.rotation.y += 0.0005;
      this.particles.rotation.x += 0.0002;

      this.particles.position.x += (this.mouseX * 0.05 - this.particles.position.x) * 0.05;
      this.particles.position.y += (-this.mouseY * 0.05 - this.particles.position.y) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  };

  private addEventListeners() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onWindowResize);
  }

  private onMouseMove = (event: MouseEvent) => {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  ngOnDestroy() {
    if (!this.isBrowser) return;

    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onWindowResize);

    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.particles) {
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
  }
}
