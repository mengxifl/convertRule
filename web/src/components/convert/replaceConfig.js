const allPropertyName = {
  shouldArchive: {
    allowImport: true,  actionType: "action", valueType: "bool",   ruleNameReable: "设置归档"
  },
  shouldMarkAsRead: {
    allowImport: true,  actionType: "action", valueType: "bool",   ruleNameReable: "标记已读"
  },
  shouldStar: {
    allowImport: true,  actionType: "action", valueType: "bool",   ruleNameReable: "设置星标"
  },
  label: {
    allowImport: true,  actionType: "action", valueType: "string", ruleNameReable: "设置标签: "
  },
  shouldTrash: {
    allowImport: true,  actionType: "action", valueType: "bool",   ruleNameReable: "移动到垃圾箱"
  },
  shouldNeverSpam: {
    allowImport: true,  actionType: "action", valueType: "bool",   ruleNameReable: "不要标记成垃圾邮件"
  },
  from: {
    allowImport: true,  actionType: "rule",   valueType: "string", ruleNameReable: "来自: "
  },
  to: {
    allowImport: true,  actionType: "rule",   valueType: "string", ruleNameReable: "发送至: "
  },
  subject: {
    allowImport: true,  actionType: "rule",   valueType: "string", ruleNameReable: "邮件主题: "
  },
  hasAttachment: {
    allowImport: true,  actionType: "rule",   valueType: "bool",   ruleNameReable: "有附件"
  },
  hasTheWord: {
    allowImport: false, actionType: "rule",   valueType: "string", ruleNameReable: "含关键字:"
  },
  forwardTo: {
    allowImport: false, actionType: "action", valueType: "string", ruleNameReable: "转发到: "
  },
  shouldNeverMarkAsImportant: {
    allowImport: false, actionType: "action", valueType: "bool",   ruleNameReable: "不要标记成为重要邮件"
  },
  shouldAlwaysMarkAsImportant: {
    allowImport: false, actionType: "action", valueType: "bool",   ruleNameReable: "设置标记为重要邮件"
  },
  smartLabelToApply: {
    allowImport: false, actionType: "action", valueType: "map",    ruleNameReable: "设置分类为",
    mapValue: {
      "^smartlabel_social":       "社交",
      "^smartlabel_notification": "动态",
      "^smartlabel_formus":       "论坛",
      "^smartlabel_personal":     "主要",
      "^smartlabel_promo":        "推广",
    }
  },
  sizeOperator: {
    allowImport: false, actionType: "rule",  valueType: "map",    ruleNameReable: "",
    mapValue: {"s_ss": "小于", "s_sl": "大于"}
  },
  size: {
    allowImport: false, actionType: "rule",   valueType: "int", ruleNameReable: "邮件"
  },
  sizeUnit: {
    allowImport: false, actionType: "rule",   valueType: "map",    ruleNameReable: "",
    mapValue: { "s_skb": "KB", "s_ss": "B", "s_smb": "MB" },
  }
}



export {
  allPropertyName
}