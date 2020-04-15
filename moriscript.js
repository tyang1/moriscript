module.exports = function(babel) {
  //here using babel to transpile the code
  //Let’s start by adding an ArrayExpression method onto our visitor object.
  // e.g. if it's of type ArrayExpression, we would want to extend the member of the code with a different method
  const { types: t } = babel;
  const moriExpressions = name => {
    const exp = t.memberExpression(t.identifier("mori"), t.identifier(name));
    exp.isClean = true;
    return exp;
  };
  return {
    visitor: {
      ArrayExpression: context => {
        context.replaceWith(
          t.callExpression(moriExpressions("vector"), context.node.elements)
        );
      },
      ObjectExpression: context => {
        let props = [];
        context.node.properties.forEach(prop => {
          props.push(t.stringLiteral(prop.key.name), prop.value);
        });
        context.replaceWith(
          t.callExpression(moriExpressions("hashMap"), props)
        );
      },
      AssignmentExpression: context => {
        let left = context.node.left;
        let right = context.node.right;
        if (t.isMemberExpression(left)) {
          if (t.isIdentifier(left.property)) {
            //pointing to a different ast creation
            left.property = t.stringLiteral(left.property.name);
          }
          //Then we replace the with with a new CallExpression using Mori’s assoc method.
          context.replaceWith(
            t.callExpression(moriExpressions("assoc"), [
              left.object,
              left.property,
              right
            ])
          );
        }
      },
      MemberExpression: context => {
        if (context.node.isClean) return;
        if (t.isAssignmentExpression(context.parent)) return;

        if (t.isIdentifier(context.node.property)) {
          context.node.property = t.stringLiteral(context.node.property.name);
        }
        context.replaceWith(
          t.callExpression(moriExpressions("get"), [
            context.node.object,
            context.node.property
          ])
        );
      }
    }
  };
};
