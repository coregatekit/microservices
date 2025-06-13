import { DataMasker } from './data-mask';

describe('DataMasker', () => {
  describe('mask', () => {
    it('should return empty string if input is empty', () => {
      expect(DataMasker.mask('')).toEqual('');
    });

    it('should return undefined if input is undefined', () => {
      expect(DataMasker.mask(undefined as unknown as string)).toBeUndefined();
    });

    describe('when handling emails', () => {
      it('should mask email local part with 3 characters visible', () => {
        expect(DataMasker.mask('test@example.com')).toEqual('tes*@example.com');
        expect(DataMasker.mask('username@domain.co')).toEqual(
          'use*****@domain.co',
        );
        expect(DataMasker.mask('abcdefg@email.org')).toEqual(
          'abc****@email.org',
        );
      });

      it('should not mask email local part if it is 3 characters or less', () => {
        expect(DataMasker.mask('abc@example.com')).toEqual('abc@example.com');
        expect(DataMasker.mask('ab@example.com')).toEqual('ab@example.com');
        expect(DataMasker.mask('a@example.com')).toEqual('a@example.com');
      });
    });

    describe('when handling regular strings', () => {
      it('should mask string with 3 characters visible', () => {
        expect(DataMasker.mask('password')).toEqual('pas*****');
        expect(DataMasker.mask('12345678')).toEqual('123*****');
        expect(DataMasker.mask('sensitive-data')).toEqual('sen***********');
      });

      it('should not mask string if it is 3 characters or less', () => {
        expect(DataMasker.mask('abc')).toEqual('abc');
        expect(DataMasker.mask('ab')).toEqual('ab');
        expect(DataMasker.mask('a')).toEqual('a');
      });
    });
  });
});
