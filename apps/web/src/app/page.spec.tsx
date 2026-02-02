import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Page from './page';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });
});
