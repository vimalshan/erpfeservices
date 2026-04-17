export class LoadProfileData {
  static readonly type = '[Profile] Load Profile Data';
}

export class SetInitialLoginStatus {
  static readonly type = '[Profile] Set Initial Login Status';

  constructor(public isInitialLogin: boolean) {}
}

export class UpdateSubmitSettingsStatus {
  static readonly type = '[Profile] Update Submit Settings Status';

  constructor(public submitSettingsStatus: boolean) {}
}

export class UpdateSubmitSettingsStateValues {
  static readonly type = '[Profile] Update Submit Settings State Values';

  constructor(public submitSettingsValues: any) {}
}

export class UpdateSubmitSettingsValues {
  static readonly type = '[Profile] Update Submit Settings Values';
}

export class LoadUserRoles {
  static readonly type = '[Settings] Load User Roles';
}

export class LoadUserRolesSuccess {
  static readonly type = '[Settings] Load User Roles Success';

  constructor(public roles: string[]) {}
}

export class ResetProfileLoadAndErrorState {
  static readonly type = '[Settings] Reset Profile Load and Error State';
}
