// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod system_utils;

use std::thread;

use lazy_static::lazy_static;
use system_utils::executor::run_command_with_logging;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, Window};


// create a mutex to store the main window
lazy_static! {
    static ref MAIN_WINDOW: std::sync::Mutex<Option<Window>> = std::sync::Mutex::new(None);
}

fn logger(message: String, js_function: String) {
    if let Ok(window) = MAIN_WINDOW.lock() {
        if let Some(win) = &*window {
            let js_code = format!("{}('{}');", js_function, message);
            win.eval(&js_code).unwrap();
        }
    }
}

#[tauri::command]
fn execute_command(command: String, args: Vec<String>, emit_event: bool) {
    // Clone the command and args to pass them to the new thread
    let command_clone = command.clone();
    let args_clone = args.clone();

    // Create a new thread to run the command in the background
    thread::spawn(move || {
        // convert from Vec<String> to Vec<&str> (required by run_command_with_logging)
        let parsed_args: Vec<&str> = args_clone.iter().map(|s| s.as_str()).collect();
        match run_command_with_logging(command_clone.as_str(), parsed_args.as_slice(), logger) {
            Ok(_) => {
                if emit_event {
                    // emit event with the command executed
                    let _ = MAIN_WINDOW
                        .lock()
                        .unwrap()
                        .as_ref()
                        .unwrap()
                        .emit("command_executed", command);
                }
            }
            Err(e) => println!("Failed to execute command: {}", e),
        }
    });
}


fn main() {
    // creating a menu for the system tray, with a quit option (add more options later if needed)
    let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");

    // creating the system tray menu with the quit option
    let system_tray_menu = SystemTrayMenu::new().add_item(quit);

    // title of the system tray
    let tray_title = "Loan App";

    // creating the tauri application
    tauri::Builder::default()
        .setup(|app| {
            //saving the main window in a mutex to use it later globally
            let main_window = app.get_window("main").unwrap();
            *MAIN_WINDOW.lock().unwrap() = Some(main_window);
            Ok(())
        })
        
        // hide to tray when the main window is closed
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        // setting the system tray
        .system_tray(
            SystemTray::new()
                .with_tooltip(tray_title)
                .with_menu(system_tray_menu),
        )
        // opening the main window when the system tray is clicked
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                // toggle application window
                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                } else {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            // handling the quit option
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        // tauri commands (to use in the frontend)
        .invoke_handler(tauri::generate_handler![execute_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
