#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use webview2_com::{
    Microsoft::Web::WebView2::Win32::{
        ICoreWebView2WebResourceRequest, COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL,
    },
    WebResourceRequestedEventHandler,
};
use windows::{core::HSTRING, Win32::System::WinRT::EventRegistrationToken};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            main_window
                .with_webview(|webview| unsafe {
                    let core = webview.controller().CoreWebView2().unwrap();
                    
                    let mut _token: EventRegistrationToken = EventRegistrationToken::default();
                    core.AddWebResourceRequestedFilter(
                        &HSTRING::from("*"),
                        COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL,
                    )
                    .unwrap();
                    core.add_WebResourceRequested(
                        &WebResourceRequestedEventHandler::create(Box::new(
                            move |_webview, args| {
                                if let Some(args) = args {
                                    let request: ICoreWebView2WebResourceRequest =
                                        args.Request().unwrap();
                                    request
                                        .Headers()
                                        .unwrap()
                                        .SetHeader(
                                            &HSTRING::from("Origin"),
                                            &HSTRING::from("http://localhost"),
                                        )
                                        .unwrap();
                                    request
                                        .Headers()
                                        .unwrap()
                                        .SetHeader(
                                            &HSTRING::from("Referer"),
                                            &HSTRING::from("http://localhost/"),
                                        )
                                        .unwrap();
                                }
                                Ok(())
                            },
                        )),
                        &mut _token,
                    )
                    .unwrap();
                })
                .unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
