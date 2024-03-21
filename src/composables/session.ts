export const sessionMouseState = useSessionStorage<'default' | 'point' | 'line' | 'polygon' | 'circle'>('sessionMouseState', 'default')
