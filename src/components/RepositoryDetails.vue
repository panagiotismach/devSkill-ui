<template>
  <div>
    <h2>Contributors</h2>
    <div v-for="contributor in contributors" :key="contributor.id">
      <ContributorCard :contributor="contributor" />
    </div>
  </div>
</template>

<script>
import ContributorCard from './ContributorCard.vue';

export default {
  components: { ContributorCard },
  props: ['contributors'],
};
</script>
