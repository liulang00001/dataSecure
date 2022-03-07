<template>
  <div class="dashboard-container">
    <div class="welcome">
       <div class="item">Welcome</div>
    </div>
    <div
      v-if="isCurrentSys"
      :id="'particles-js-' + $store.sysCode"
      :color="color"
      :particleOpacity="particleOpacity"
      :linesColor="linesColor"
      :particlesNumber="particlesNumber"
      :shapeType="shapeType"
      :particleSize="particleSize"
      :linesWidth="linesWidth"
      :lineLinked="lineLinked"
      :lineOpacity="lineOpacity"
      :linesDistance="linesDistance"
      :moveSpeed="moveSpeed"
      :hoverEffect="hoverEffect"
      :hoverMode="hoverMode"
      :clickEffect="clickEffect"
      :clickMode="clickMode"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'dashboard',
  data() {
    return {
      currentRole: 'adminDashboard',
      color: '#aeaeae',
      particleOpacity: 0.7,
      particlesNumber: 80,
      shapeType: 'circle',
      particleSize: 4,
      linesColor: '#deaeae',
      linesWidth: 1,
      lineLinked: true,
      lineOpacity: 0.4,
      linesDistance: 150,
      moveSpeed: 3,
      hoverEffect: true,
      hoverMode: 'grab',
      clickEffect: true,
      clickMode: 'push',
    }
  },
  computed: {
    ...mapGetters([
      'roles',
    ]),
    isCurrentSys() {
      return this.$store.sysCode ? (window._globalInfo && window._globalInfo.currentSysCode === this.$store.sysCode) : true;
    },
  },
  methods: {
    initParticleJS (
      color,
      particleOpacity,
      particlesNumber,
      shapeType,
      particleSize,
      linesColor,
      linesWidth,
      lineLinked,
      lineOpacity,
      linesDistance,
      moveSpeed,
      hoverEffect,
      hoverMode,
      clickEffect,
      clickMode
    ) {
      particlesJS('particles-js-' + this.$store.sysCode, {
        "particles": {
          "number": {
            "value": particlesNumber,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": color
          },
          "shape": {
            // circle, edge, triangle, polygon, star, image
            "type": shapeType,
            "stroke": {
              "width": 0,
              "color": "#192231"
            },
            "polygon": {
              "nb_sides": 5
            }
          },
          "opacity": {
            "value": particleOpacity,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": particleSize,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": lineLinked,
            "distance": linesDistance,
            "color": linesColor,
            "opacity": lineOpacity,
            "width": linesWidth
          },
          "move": {
            "enable": true,
            "speed": moveSpeed,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": hoverEffect,
              "mode": hoverMode
            },
            "onclick": {
              "enable": clickEffect,
              "mode": clickMode
            },
            "onresize": {

              "enable": true,
              "density_auto": true,
              "density_area": 400

            }
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });
    }
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  mounted() {
    if(this.isCurrentSys) {
      this.$nextTick(() => {
        this.initParticleJS(
          this.color,
          this.particleOpacity,
          this.particlesNumber,
          this.shapeType,
          this.particleSize,
          this.linesColor,
          this.linesWidth,
          this.lineLinked,
          this.lineOpacity,
          this.linesDistance,
          this.moveSpeed,
          this.hoverEffect,
          this.hoverMode,
          this.clickEffect,
          this.clickMode
        );
      });
    }
  },
}
</script>
<style lang="scss" scoped>

.welcome{
    display: flex;
    font-family: Teko,sans-serif;
    text-shadow: 1px 1px #000;
    text-transform: uppercase;
    margin-top: 5%;
    font-size: 40px;
    justify-content: center;
    align-items:center;
    color: #cccccc;
    font-style:italic;
    font-family:"Times New Roman",Georgia,Serif
}
</style>
