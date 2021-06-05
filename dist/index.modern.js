import { createElement } from 'react';

var styles = {"test":"_3ybTi"};

var LiveKitRoom = function LiveKitRoom(props) {
  console.log(props.url);
  return createElement("div", null);
};

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};

export { ExampleComponent, LiveKitRoom };
//# sourceMappingURL=index.modern.js.map
