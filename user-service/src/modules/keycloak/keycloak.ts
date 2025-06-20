export class CreateKeycloakUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;

  constructor(data: Partial<CreateKeycloakUser>) {
    this.uid = data.uid || '';
    this.email = data.email || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.password = data.password || '';
  }
}

export class LoginRequest {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
