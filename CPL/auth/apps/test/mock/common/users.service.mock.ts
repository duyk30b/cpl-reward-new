/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

export class UsersServiceMock {
  async getUserById() {}
  async getUserByEmail() {}
  async logoutAllDevices() {}
  async getLoginUser() {}
  checkPasswordWithUser() {}
  async checkPasswordWithUserId() {}
  async checkEmailExist() {}
  async create() {}
  async getUserByIdWithPrivateField() {}
  async setNewPassword() {}
  async addEmailAuthentication() {}
  async useAuthPasswordEncryptor() {}
  async updateLastLogin() {}
  async getUserByReferrerCode() {}
  async getOtpSecretByUserId() {
    return 'TEST'
  }
  async changeEmail() {}
  async setUserInfoUpdated() {}
}
