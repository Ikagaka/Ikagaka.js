
declare class Ikagaka {
  constructor(); // unstable
  element: HTMLElement; // stable
}

declare module Ikagaka {
}

declare module 'ikagaka' {
  var foo: typeof Ikagaka;
  module rsvp {
    export var Ikagaka: typeof foo;
  }
  export = rsvp;
}

declare class NamedManager {
  constructor(nar: Nar, callback: () => void); // unstable
  materialize(nar: Nar, callback: (ghost: NamedManager) => void): void; // unstable
  vanish(callback: () => void): void; // unstable
  changeShell(shellName: string, callback: () => void): void; // unstable
  element: HTMLElement; // stable
}
