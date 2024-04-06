import { jest } from '@jest/globals';
import { createElement, Fragment, FunctionComponent, ReactElement } from 'react';

type ComponentType<T> = T extends FunctionComponent<infer P> ? FunctionComponent<P> : never;
type MockedComponent<T extends FunctionComponent> = jest.Mocked<ComponentType<T>>;

function mockComponent<T extends FunctionComponent<any>>(
	element: ReactElement = createElement(Fragment),
): MockedComponent<T> {
	return jest.fn(() => element) as unknown as MockedComponent<T>;
}

export default mockComponent;
