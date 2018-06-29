# light-hoc

A HOC to use [@parity/light.js](https://github.com/parity-js/light.js) with React. Basically the equivalent of oo7-react for Observables.

Probably this should go inside its own repo.

## Usage

The libray provides a higher-order component to use these Observables easily with React apps.

```javascript
import light from '???'; // ??? to be decided
import { syncing$ } from '@parity/light.js';

@light({
  syncingVariable: syncing$
})
class MyClass extends React.Component {
  render() {
    return <div>{JSON.stringify(this.props.syncingVariable)}</div>;
  }
}
```

The UI will automatically update when the syncing state changes.
