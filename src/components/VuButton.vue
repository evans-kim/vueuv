<script lang="ts">
export default {
  name: "VuButton",
  functional: true,
  render: function (createElement, context) {
    // Transparently pass any attributes, event listeners, children, etc.
    const data = context.data;
    data.class = ['p-1', 'shadow', 'border', 'inline-block', 'focus:outline-none']
    if (data.attrs && data.attrs.color) {
      let color = '';
      switch (data.attrs.color) {
        case 'red':
          color = 'bg-red-600';
          break;
        case 'yellow':
          color = 'bg-blue-600';
          break;
        case 'blue':
          color = 'bg-blue-600';
          break;
        default:
          color = "bg-green-600"

      }
      data.class.push(color)
      data.class.push('text-white')
    } else {
      data.class.push('bg-white')
    }

    return createElement('button', data, context.children)
  }
}
</script>