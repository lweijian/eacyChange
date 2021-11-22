
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema



const validator = {
  "username": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "用户名"
  },
  "password_secret_version": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "passwordSecret"
  },
  "nickname": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "昵称"
  },
  "gender": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "未知",
            "value": 0
          },
          {
            "text": "男",
            "value": 1
          },
          {
            "text": "女",
            "value": 2
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "性别"
  },
  "status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "正常",
            "value": 0
          },
          {
            "text": "禁用",
            "value": 1
          },
          {
            "text": "审核中",
            "value": 2
          },
          {
            "text": "审核拒绝",
            "value": 3
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "用户状态"
  },
  "mobile": {
    "rules": [
      {
        "format": "string"
      },
      {
        "pattern": "^\\+?[0-9-]{3,20}$"
      }
    ],
    "label": "手机号码"
  },
  "mobile_confirmed": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "未验证",
            "value": 0
          },
          {
            "text": "已验证",
            "value": 1
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "手机号验证状态"
  },
  "email": {
    "rules": [
      {
        "format": "string"
      },
      {
        "format": "email"
      }
    ],
    "label": "邮箱"
  },
  "email_confirmed": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "未验证",
            "value": 0
          },
          {
            "text": "已验证",
            "value": 1
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "邮箱验证状态"
  },
  "avatar": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "头像地址"
  },
  "avatar_file": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "头像文件"
  },
  "department_id": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "label": "部门"
  },
  "wx_unionid": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "wx_openid": {
    "rules": [
      {
        "format": "object"
      }
    ]
  },
  "ali_openid": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "apple_openid": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "dcloud_appid": {
    "rules": [
      {
        "format": "array"
      }
    ]
  },
  "comment": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "备注"
  },
  "realname_auth": {
    "rules": [
      {
        "format": "object"
      }
    ]
  },
  "score": {
    "rules": [
      {
        "format": "int"
      }
    ]
  },
  "last_login_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "last_login_ip": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "token": {
    "rules": [
      {
        "format": "array"
      }
    ]
  },
  "inviter_uid": {
    "rules": [
      {
        "format": "array"
      }
    ]
  },
  "invite_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
  },
  "my_invite_code": {
    "rules": [
      {
        "format": "string"
      }
    ]
  }
}

const enumConverter = {
  "gender_valuetotext": {
    "0": "未知",
    "1": "男",
    "2": "女"
  },
  "status_valuetotext": {
    "0": "正常",
    "1": "禁用",
    "2": "审核中",
    "3": "审核拒绝"
  },
  "mobile_confirmed_valuetotext": {
    "0": "未验证",
    "1": "已验证"
  },
  "email_confirmed_valuetotext": {
    "0": "未验证",
    "1": "已验证"
  }
}

export { validator, enumConverter }
