export interface SidebarContent {
  title: string;
  subtitle: string;
  description: string;
  footer: string;
}

export interface MediaItem {
  type?: 'image' | 'video';
  src: string;
  alt: string;
  position: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    width: string;
    height: string;
  };
  zIndex: number;
  sidebar: SidebarContent;
  enableSidebarShift: boolean;
  clickable: boolean;
}

export interface PageConfig {
  meta: {
    title: string;
    theme: string;
  };
  images: MediaItem[];
  sidebarStyle: {
    width: string;
    background: string;
    backdropBlur: string;
    borderColor: string;
  };
}

export const pageConfigs: Record<string, PageConfig> = {
  visions: {
    meta: {
      title: 'Visions from the Past',
      theme: 'tech-dark',
    },
    images: [
      {
        src: '/images/page1_1.png',
        alt: 'Vision 1',
        position: {
          top: '35vh',
          left: '4vw',
          width: '30vw',
          height: 'auto',
        },
        zIndex: 10,
        sidebar: {
          title: 'Graphic Design',
          subtitle: 'EMERGING: A-92',
          description: `
            <p>ANALYSIS::</p>
            <p>Some of the design works.</p>
            <p>Origin:SHTU_SCA</p>
            <p>Stickers available.</p>
            <p>The remaining design can be seen in the North Hall of SCA</p>
          `,
          footer: 'COGNITIVE_LOAD: NORMAL',
        },
        enableSidebarShift: false,
        clickable: true,
      },
      {
        src: '/images/page1_2.png',
        alt: 'Vision 2',
        position: {
          top: '12vh',
          right: '22vw',
          width: '20vw',
          height: 'auto',
        },
        zIndex: 15,
        sidebar: {
          title: 'Graphic Design',
          subtitle: 'EMERGING: B-47',
          description: `
            <p>ANALYSIS::</p>
            <p>Some of the design works.</p>
            <p>Origin:SHTU_SCA</p>
            <p style="margin-top: 1rem;">Origami pattern</p>
          `,
          footer: 'TIMELINE_INTEGRITY: 25_7_??',
        },
        enableSidebarShift: true,
        clickable: true,
      },
      {
        src: '/images/page1_3.png',
        alt: 'Vision 3',
        position: {
          top: '12vh',
          left: '18vw',
          width: '28vw',
          height: 'auto',
        },
        zIndex: 12,
        sidebar: {
          title: 'Graphic Design',
          subtitle: 'EMERGING: C-19',
          description: `
            <p>FREQUENCY_ANALYSIS::</p>
            <p>Resonant frequency: 432 Hz</p>
            <p>No physical items</p>
            <p style="margin-top: 1rem;">This is a photo from the official website of the 2021 graduation exhibition.</p>
            <p>Standing wave stabilized.</p>
            <p>Energy dissipation: 3.2%/s</p>
          `,
          footer: 'WAVE_FUNCTION: STABLE',
        },
        enableSidebarShift: false,
        clickable: true,
      },
      {
        src: '/images/page1_4.png',
        alt: 'Vision 4',
        position: {
          bottom: '10vh',
          right: '28vw',
          width: '25vw',
          height: 'auto',
        },
        zIndex: 8,
        sidebar: {
          title: 'FRAGMENT_04',
          subtitle: 'DATA CLUSTER: D-83',
          description: `
            <p>RECONSTRUCTION::</p>
            <p>Data integrity: 78.4%</p>
            <p>Missing sectors: 12</p>
            <p style="margin-top: 1rem;">Attempting neural interpolation...</p>
            <p>Confidence level: MODERATE</p>
            <p style="color: rgba(255, 200, 100, 0.8);">⚠️ Partial recovery only</p>
          `,
          footer: 'RECOVERY_STATUS: IN_PROGRESS',
        },
        enableSidebarShift: true,
        clickable: true,
      },
    ],
    sidebarStyle: {
      width: '25vw',
      background: 'rgba(80, 80, 80, 0.85)',
      backdropBlur: '8px',
      borderColor: 'rgba(255, 255, 255, 0.75)',
    },
  },

  dimensional: {
    meta: {
      title: 'Dimensional Folding',
      theme: 'tech-dark',
    },
    images: [
      {
        src: '/images/page2_1.jpg',
        alt: 'Fold 1',
        position: {
          top: '46vh',
          left: '5vw',
          width: '20vw',
          height: 'auto',
        },
        zIndex: 11,
        sidebar: {
          title: 'FOLD_EPSILON',
          subtitle: 'NEXUS POINT: F-05',
          description: `
            <p>NEXUS_STATUS::</p>
            <p>Convergence point identified.</p>
            <p>Dimensional intersections: 7</p>
            <p style="margin-top: 1rem;">Multi-path routing established.</p>
            <p>Network topology: STABLE</p>
            <p>Latency: <1ms across all paths</p>
          `,
          footer: 'NEXUS_INTEGRITY: OPTIMAL',
        },
        enableSidebarShift: false,
        clickable: true,
      },
      {
        src: '/images/page2_2.jpg',
        alt: 'Fold 2',
        position: {
          bottom: '2vh',
          right: '18vw',
          width: '22vw',
          height: 'auto',
        },
        zIndex: 8,
        sidebar: {
          title: 'FOLD_DELTA',
          subtitle: 'COMPRESSION ZONE: F-04',
          description: `
            <p>COMPRESSION_DATA::</p>
            <p>Space-time ratio: 1:847</p>
            <p>Density factor: CRITICAL</p>
            <p style="margin-top: 1rem;">Matter compression proceeding.</p>
            <p>Hawking radiation detected.</p>
            <p style="color: rgba(255, 150, 100, 0.8);">⚠️ Approaching event horizon</p>
          `,
          footer: 'GRAVITATIONAL_STRESS: HIGH',
        },
        enableSidebarShift: true,
        clickable: true,
      },
      {
        type: 'video',
        src: '/videos/clip1.mp4',
        alt: 'Dimensional Video 1',
        position: {
          top: '8vh',
          left: '12vw',
          width: '34vw',
          height: 'auto',
        },
        zIndex: 10,
        sidebar: {
          title: 'MOTION_05',
          subtitle: 'TEMPORAL STREAM: V-01',
          description: `
            <p>VIDEO_ANALYSIS::</p>
            <p>Frame rate: 30 FPS</p>
            <p>Duration: LOOP</p>
            <p style="margin-top: 1rem;">Neural motion tracking active.</p>
            <p>Pattern recognition: ENABLED</p>
            <p>Playback: CONTINUOUS</p>
          `,
          footer: 'VIDEO_STATUS: PLAYING',
        },
        enableSidebarShift: false,
        clickable: true,
      },
      {
        type: 'video',
        src: '/videos/clip5.mp4',
        alt: 'Dimensional Video 2',
        position: {
          top: '12vh',
          right: '28vw',
          width: '24vw',
          height: 'auto',
        },
        zIndex: 10,
        sidebar: {
          title: 'MOTION_06',
          subtitle: 'TEMPORAL STREAM: V-02',
          description: `
            <p>VIDEO_ANALYSIS::</p>
            <p>Frame rate: 30 FPS</p>
            <p>Duration: LOOP</p>
            <p style="margin-top: 1rem;">Neural motion tracking active.</p>
            <p>Pattern recognition: ENABLED</p>
            <p>Playback: CONTINUOUS</p>
          `,
          footer: 'VIDEO_STATUS: PLAYING',
        },
        enableSidebarShift: true,
        clickable: true,
      },
      {
        type: 'video',
        src: '/videos/clip3.mp4',
        alt: 'Dimensional Video 3',
        position: {
          bottom: '14vh',
          left: '27vw',
          width: '28vw',
          height: 'auto',
        },
        zIndex: 9,
        sidebar: {
          title: 'MOTION_07',
          subtitle: 'TEMPORAL STREAM: V-03',
          description: `
            <p>VIDEO_ANALYSIS::</p>
            <p>Frame rate: 30 FPS</p>
            <p>Duration: LOOP</p>
            <p style="margin-top: 1rem;">Neural motion tracking active.</p>
            <p>Pattern recognition: ENABLED</p>
            <p>Playback: CONTINUOUS</p>
          `,
          footer: 'VIDEO_STATUS: PLAYING',
        },
        enableSidebarShift: false,
        clickable: true,
      },
    ],
    sidebarStyle: {
      width: '28vw',
      background: 'rgba(91, 91, 91, 0.85)',
      backdropBlur: '6px',
      borderColor: 'rgba(255, 255, 255, 0.8)',
    },
  },

  horizon: {
    meta: {
      title: 'Event Horizon',
      theme: 'tech-dark',
    },
    images: [
      {
        src: '/images/page3_5.jpg',
        alt: 'Horizon 1',
        position: {
          top: '14vh',
          left: '10vw',
          width: '24vw',
          height: 'auto',
        },
        zIndex: 10,
        sidebar: {
          title: 'SINGULARITY_01',
          subtitle: 'SCHWARZSCHILD RADIUS: BREACHED',
          description: `
            <p>EVENT_HORIZON::</p>
            <p>Gravitational pull: INFINITE</p>
            <p>Escape velocity: >c</p>
            <p style="margin-top: 1rem;">Time dilation: EXTREME</p>
            <p>Spaghettification zone entered.</p>
            <p style="color: rgba(255, 100, 100, 0.9);">⚠️ CRITICAL: NO RETURN</p>
          `,
          footer: 'HORIZON_DISTANCE: 0.0km',
        },
        enableSidebarShift: false,
        clickable: true,
      },
      {
        src: '/images/page3_2.png',
        alt: 'Horizon 2',
        position: {
          top: '27vh',
          right: '18vw',
          width: '18vw',
          height: 'auto',
        },
        zIndex: 15,
        sidebar: {
          title: 'ACCRETION_02',
          subtitle: 'MATTER STREAM: ACTIVE',
          description: `
            <p>ACCRETION_DISK::</p>
            <p>Temperature: 10^7 K</p>
            <p>Rotation speed: 0.87c</p>
            <p style="margin-top: 1rem;">X-ray emission: INTENSE</p>
            <p>Matter infall rate: 10^24 kg/s</p>
            <p>Jets detected at poles.</p>
          `,
          footer: 'DISK_STABILITY: TURBULENT',
        },
        enableSidebarShift: true,
        clickable: true,
      },
      {
        src: '/images/page3_4.png',
        alt: 'Horizon 3',
        position: {
          bottom: '13vh',
          left: '18vw',
          width: '19vw',
          height: 'auto',
        },
        zIndex: 12,
        sidebar: {
          title: 'PHOTON_SPHERE_03',
          subtitle: 'LIGHT ORBIT: UNSTABLE',
          description: `
            <p>PHOTON_SPHERE::</p>
            <p>Orbital radius: 1.5 Rs</p>
            <p>Light trapping active.</p>
            <p style="margin-top: 1rem;">Gravitational lensing: SEVERE</p>
            <p>Einstein ring visible.</p>
            <p>Observer image distortion: 400%</p>
          `,
          footer: 'LIGHT_BENDING: EXTREME',
        },
        enableSidebarShift: false,
        clickable: true,
      },
      {
        type: 'video',
        src: '/videos/clip4.mp4',
        alt: 'Horizon Video 1',
        position: {
          top: '55vh',
          right: '25vw',
          width: '32vw',
          height: 'auto',
        },
        zIndex: 13,
        sidebar: {
          title: 'TEMPORAL_FLUX_04',
          subtitle: 'GRAVITATIONAL WAVES: DETECTED',
          description: `
            <p>WAVE_ANALYSIS::</p>
            <p>Amplitude: EXTREME</p>
            <p>Frequency: 0.01 Hz</p>
            <p style="margin-top: 1rem;">Spacetime ripples propagating.</p>
            <p>Binary system merger detected.</p>
            <p>Energy release: 3 solar masses/s</p>
          `,
          footer: 'DETECTION_CONFIDENCE: 99.7%',
        },
        enableSidebarShift: true,
        clickable: true,
      },
      {
        type: 'video',
        src: '/videos/clip2.mp4',
        alt: 'Horizon Video 2',
        position: {
          top: '20vh',
          right: '40vw',
          width: '28vw',
          height: 'auto',
        },
        zIndex: 14,
        sidebar: {
          title: 'TEMPORAL_FLUX_05',
          subtitle: 'TIME DILATION: EXTREME',
          description: `
            <p>TIME_ANALYSIS::</p>
            <p>Dilation factor: 10^6</p>
            <p>Causal loop detected.</p>
            <p style="margin-top: 1rem;">Temporal paradox resolved.</p>
            <p>Closed timelike curves: STABLE</p>
            <p>Chronology protection: VIOLATED</p>
          `,
          footer: 'TEMPORAL_STATUS: UNSTABLE',
        },
        enableSidebarShift: false,
        clickable: true,
      },
    ],
    sidebarStyle: {
      width: '25vw',
      background: 'rgba(80, 80, 80, 0.85)',
      backdropBlur: '8px',
      borderColor: 'rgba(255, 255, 255, 0.75)',
    },
  },
};
