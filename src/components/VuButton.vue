<script lang="ts">
export default {
  name: "VuButton",
  functional: true,
  render: function (createElement, context) {
    // Transparently pass any attributes, event listeners, children, etc.
    const data = context.data;
    data.class = ['p-1', 'shadow', 'border', 'inline-block', 'focus:outline-none']
    if(data.attrs && data.attrs.color){
      data.class.push(`bg-${data.attrs.color}-600`)
      data.class.push(`text-white`)
    }else{
      data.class.push(`bg-white`)
    }

    return createElement('button', data, context.children)
  }
}
</script>