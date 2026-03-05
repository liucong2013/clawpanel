/**
 * npm install / upgrade 常见错误诊断
 * 解析 npm 错误信息，返回用户友好的提示和修复建议
 */

/**
 * @param {string} errStr - npm 错误输出
 * @returns {{ title: string, hint?: string, command?: string }}
 */
export function diagnoseInstallError(errStr) {
  const s = errStr.toLowerCase()

  // git 未安装（exit 128 + access rights）
  if (s.includes('code 128') || s.includes('exit 128') || s.includes('access rights')) {
    return {
      title: '安装失败 — 需要安装 Git',
      hint: '部分依赖需要通过 Git 下载。请先安装 Git 后重试。',
      command: '下载 Git: https://git-scm.com/downloads',
    }
  }

  // ENOENT（文件找不到）
  if (s.includes('enoent') || s.includes('-4058') || s.includes('code -4058')) {
    return {
      title: '安装失败 — 文件访问错误',
      hint: '尝试以管理员身份运行 ClawPanel，或在终端手动安装：',
      command: 'npm install -g @qingchencloud/openclaw-zh --registry https://registry.npmmirror.com',
    }
  }

  // 权限不足（EACCES / EPERM）
  if (s.includes('eacces') || s.includes('eperm') || s.includes('permission denied')) {
    const isMac = navigator.platform?.includes('Mac') || navigator.userAgent?.includes('Mac')
    return {
      title: '安装失败 — 权限不足',
      hint: isMac ? '请在终端使用 sudo 安装：' : '请以管理员身份打开终端安装：',
      command: isMac
        ? 'sudo npm install -g @qingchencloud/openclaw-zh --registry https://registry.npmmirror.com'
        : 'npm install -g @qingchencloud/openclaw-zh --registry https://registry.npmmirror.com',
    }
  }

  // 网络错误
  if (s.includes('etimedout') || s.includes('econnrefused') || s.includes('enotfound')
    || s.includes('network') || s.includes('fetch failed') || s.includes('socket hang up')) {
    return {
      title: '安装失败 — 网络连接错误',
      hint: '请检查网络连接，或尝试切换 npm 镜像源后重试。',
    }
  }

  // npm 缓存损坏
  if (s.includes('integrity') || s.includes('sha512') || s.includes('cache')) {
    return {
      title: '安装失败 — npm 缓存异常',
      hint: '尝试清理 npm 缓存后重试：',
      command: 'npm cache clean --force',
    }
  }

  // 通用 fallback
  return {
    title: '安装失败',
    hint: '请在终端手动尝试安装，查看完整错误信息：',
    command: 'npm install -g @qingchencloud/openclaw-zh --registry https://registry.npmmirror.com',
  }
}
