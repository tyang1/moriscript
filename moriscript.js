module.exports = function(babel) {
  //here using babel to transpile the code
  //Let’s start by adding an ArrayExpression method onto our visitor object.
  // e.g. if it's of type ArrayExpression, we would want to extend the member of the code with a different method
  const { types: t } = babel;
  return {
    visitor: {
      ArrayExpression: context => {
        context.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier("mori"), t.identifier("vector")),
            context.node.elements
          )
        );
      },
      ObjectExpression: context => {
        let props = [];
        context.node.properties.forEach(prop => {
          props.push(t.stringLiteral(prop.key.name), prop.value);
        });
        context.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier("mori"), t.identifier("hashMap")),
            props
          )
        );
      }
    }
  };
};
