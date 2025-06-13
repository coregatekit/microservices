export class DataMasker {
  /**
   * Masks a string by showing the first 3 characters and replacing the rest with asterisks.
   * For emails, preserves the domain part (after @).
   * @param value The string to mask
   * @returns The masked string
   */
  static mask(value: string): string {
    if (!value) return value;

    // Check if the string is an email
    const emailRegex = /^([^@]+)@(.+)$/;
    const emailMatch = value.match(emailRegex);

    if (emailMatch) {
      // Handle email pattern
      const localPart = emailMatch[1];
      const domain = emailMatch[2];

      if (localPart.length <= 3) {
        return `${localPart}@${domain}`;
      }

      const maskedLocalPart =
        localPart.substring(0, 3) + '*'.repeat(localPart.length - 3);
      return `${maskedLocalPart}@${domain}`;
    } else {
      // Handle regular string
      if (value.length <= 3) {
        return value;
      }

      return value.substring(0, 3) + '*'.repeat(value.length - 3);
    }
  }
}
