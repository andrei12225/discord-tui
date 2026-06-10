import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	ReactNode,
} from 'react';

export enum AppElements {
	GUILDS,
	CHANNELS,
	__LENGTH,
}

export interface FocusContextValue {
	focusedElement: AppElements;
	setFocusedElement: (element: AppElements) => void;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function FocusProvider({children}: {children: ReactNode}) {
	const [focusedElement, setFocusedElement] = useState<AppElements>(
		AppElements.GUILDS,
	);

	const value = useMemo(
		() => ({focusedElement, setFocusedElement}),
		[focusedElement],
	);

	return <FocusContext value={value}>{children}</FocusContext>;
}

export class FocusManager {
	constructor(
		public readonly focusedElement: AppElements,
		public readonly setFocusedElement: (element: AppElements) => void,
	) {}

	// focusLeft() {
	// 	const nextIndex =
	// 		(this.focusedElement - 1 + AppElements.__LENGTH) % AppElements.__LENGTH;
	// 	this.setFocusedElement(nextIndex);
	// }

	// focusRight() {
	// 	const nextIndex = (this.focusedElement + 1) % AppElements.__LENGTH;
	// 	this.setFocusedElement(nextIndex);
	// }
}

export function useAppFocus(): FocusManager {
	const context = useContext(FocusContext);
	if (!context) {
		throw new Error('useAppFocus must be used within a FocusProvider');
	}

	const {focusedElement, setFocusedElement} = context;

	return useMemo(() => {
		return new FocusManager(focusedElement, setFocusedElement);
	}, [focusedElement]);
}
