import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { applyAction } from './domain';
import type { Actor, FleetAction, FleetState } from './domain';
import { createDemoState } from './fixtures';

type Toast = { id: number; text: string; error: boolean };

type Fleet = {
  state: FleetState;
  actor: Actor | null;
  toast: Toast | null;
  signIn: (actor: Actor) => void;
  signOut: () => void;
  perform: (action: FleetAction) => string | null;
  reset: () => void;
  notify: (text: string, error?: boolean) => void;
};

const FleetContext = createContext<Fleet | null>(null);
const clock = new Intl.DateTimeFormat('en-GB', {hour: '2-digit', minute: '2-digit'});

export function FleetProvider({children}: { children: React.ReactNode }) {
  const [state, setState] = useState(createDemoState);
  const [actor, setActor] = useState<Actor | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const sequence = useRef(0);

  const notify = useCallback((text: string, error = false) => {
    sequence.current += 1;
    setToast({id: sequence.current, text, error});
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(current => current?.id === toast.id ? null : current), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const perform = useCallback((action: FleetAction): string | null => {
    if (!actor) return 'Choose a profile first.';
    try {
      const next = applyAction(state, action, actor, `Today ${clock.format(new Date())}`);
      if (next !== state) {
        const changed = next.orders.find((order, index) => order !== state.orders[index]) ?? next.orders[0];
        if (changed?.events[0]) notify(changed.events[0].title);
        setState(next);
      }
      return null;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      notify(message, true);
      return message;
    }
  }, [actor, state, notify]);

  const value = useMemo<Fleet>(() => ({
    state,
    actor,
    toast,
    signIn: setActor,
    signOut: () => setActor(null),
    perform,
    reset: () => {
      setState(createDemoState());
      notify('Demo data restored');
    },
    notify,
  }), [state, actor, toast, perform, notify]);

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

export function useFleet(): Fleet {
  const fleet = useContext(FleetContext);
  if (!fleet) throw new Error('useFleet must be used inside FleetProvider');
  return fleet;
}

export function useSignedIn(): Fleet & { actor: Actor } {
  const fleet = useFleet();
  if (!fleet.actor) throw new Error('No active profile');
  return fleet as Fleet & { actor: Actor };
}
