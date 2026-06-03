import { describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';

import { AppModule } from './app.module';

import { capitalize } from '@pkg/shared';

describe('AppModule', () => {
  it('should compile', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});

describe('shared', () => {
  it('should import workspace package', () => {
    expect(capitalize('hello')).toBe('Hello');
  });
});
