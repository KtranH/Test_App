<template>
  <div 
    class="page-transition-wrapper"
    :data-aos="aosAnimation"
    :data-aos-duration="aosDuration"
    :data-aos-delay="aosDelay"
    :data-aos-offset="aosOffset"
  >
    <slot />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  aosAnimation: {
    type: String,
    default: 'fade-up'
  },
  aosDuration: {
    type: [Number, String],
    default: 800,
    validator: (value) => {
      // Chấp nhận cả Number và String, nhưng convert String thành Number
      const numValue = Number(value)
      return !isNaN(numValue) && numValue > 0
    }
  },
  aosDelay: {
    type: [Number, String],
    default: 0,
    validator: (value) => {
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0
    }
  },
  aosOffset: {
    type: [Number, String],
    default: 100,
    validator: (value) => {
      const numValue = Number(value)
      return !isNaN(numValue) && numValue >= 0
    }
  }
})

// Computed properties để đảm bảo type đúng
import { computed } from 'vue'

const aosDurationComputed = computed(() => Number(props.aosDuration))
const aosDelayComputed = computed(() => Number(props.aosDelay))
const aosOffsetComputed = computed(() => Number(props.aosOffset))
</script>

<style scoped>
.page-transition-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* Custom AOS animations */
[data-aos="slide-in-left"] {
  transform: translateX(-100%);
  opacity: 0;
  transition-property: transform, opacity;
}

[data-aos="slide-in-left"].aos-animate {
  transform: translateX(0);
  opacity: 1;
}

[data-aos="slide-in-right"] {
  transform: translateX(100%);
  opacity: 0;
  transition-property: transform, opacity;
}

[data-aos="slide-in-right"].aos-animate {
  transform: translateX(0);
  opacity: 1;
}

[data-aos="slide-in-up"] {
  transform: translateY(100%);
  opacity: 0;
  transition-property: transform, opacity;
}

[data-aos="slide-in-up"].aos-animate {
  transform: translateY(0);
  opacity: 1;
}

[data-aos="slide-in-down"] {
  transform: translateY(-100%);
  opacity: 0;
  transition-property: transform, opacity;
}

[data-aos="slide-in-down"].aos-animate {
  transform: translateY(0);
  opacity: 1;
}
</style>
