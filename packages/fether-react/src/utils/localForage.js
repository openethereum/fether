import { from, Observable } from "rxjs";
import localForage from "localforage";
import { switchMap } from "rxjs/operators";
import "localforage-observable";

// Use RxJS as Observable in localforage-observable
// https://github.com/localForage/localForage-observable#using-a-different-observable-library
localForage.newObservable.factory = subscribeFn =>
  Observable.create(subscribeFn);

/**
 * Make localForage available in browser console for easier debug.
 */
if (process.env.NODE_ENV !== "production") {
  window.localForage = localForage;
}

/**
 * Use localStorage.
 *
 * TODO: Maybe other drivers might be more appropriate?
 */
localForage.setDriver(localForage.LOCALSTORAGE);

// Initialize localForage
const ready$ = from(localForage.ready());

/**
 * Create an Observable that will fire when a localForage item updates.
 *
 * @param {string} item - The localForage key to query
 */
const localForage$ = item =>
  ready$.pipe(switchMap(() => localForage.getItemObservable(item)));

export default localForage$;
