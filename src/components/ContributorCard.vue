<template>
  <div>
    <h3>{{ contributor.name }}</h3>
    <p>Contributions: {{ contributor.contributions }}</p>
  </div>
</template>

<script>
export default {
  props: ['contributor'],
};
</script>
