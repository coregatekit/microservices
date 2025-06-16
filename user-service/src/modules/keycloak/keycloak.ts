export class CreateKeycloakUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;

  constructor(data: Partial<CreateKeycloakUser>) {
    this.email = data.email || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.password = data.password || '';
  }
}
