use std::path::PathBuf;

pub mod agent;
pub mod config;
pub mod device;
pub mod extensions;
pub mod logs;
pub mod memory;
pub mod pairing;
pub mod service;

/// 获取 OpenClaw 配置目录 (~/.openclaw/)
pub fn openclaw_dir() -> PathBuf {
    dirs::home_dir().unwrap_or_default().join(".openclaw")
}

/// macOS/Linux 上 Tauri 从 Finder 启动时 PATH 很短（只有 /usr/bin:/bin:/usr/sbin:/sbin），
/// 需要补充 Node.js / npm 常见安装路径，否则 check_node / npm_command 找不到命令
#[cfg(not(target_os = "windows"))]
pub fn enhanced_path() -> String {
    let current = std::env::var("PATH").unwrap_or_default();
    let home = dirs::home_dir().unwrap_or_default();
    let extra: Vec<String> = vec![
        "/usr/local/bin".into(),
        "/opt/homebrew/bin".into(),
        format!("{}/.nvm/current/bin", home.display()),
        format!("{}/.volta/bin", home.display()),
        format!("{}/.nodenv/shims", home.display()),
        format!("{}/.fnm/current/bin", home.display()),
        format!("{}/n/bin", home.display()),
    ];
    let mut parts: Vec<&str> = extra.iter().map(|s| s.as_str()).collect();
    if !current.is_empty() {
        parts.push(&current);
    }
    parts.join(":")
}
