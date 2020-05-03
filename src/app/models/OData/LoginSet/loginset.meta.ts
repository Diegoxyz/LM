export const LoginMeta = {
    type: "LoginSet",
    set: "LoginSet",
    fields: {
        username: {type: 'string', nullable: true},
        password: {type: 'string', nullable: true},
        token: {type: 'string', nullable: true}
      }
}

