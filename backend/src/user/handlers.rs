use crate::user::models::AuthReq;
use axum::{
    extract::{Json, State},
    http::{HeaderMap, StatusCode, header::SET_COOKIE},
    middleware::Next,
};
use serde_json::json;
use sqlx::PgPool;

// Create session cookie header
// Not exactly a session, but like a watered-down JWT as I didn't have enough time to actually implement a JWT so bear with me here TvT
fn cookie(username: &str, status: bool) -> HeaderMap {
    let mut headers = HeaderMap::new();
    let cookie_value = if status {
        // For logout, set an expired cookie
        "session=; Path=/; Max-Age=0".to_string()
    } else {
        // For login, set the username in the cookie
        format!("session={}; Path=/; Secure; SameSite=None", username)
    };

    headers.insert(SET_COOKIE, cookie_value.parse().unwrap());
    println!("{:?}", headers.get(SET_COOKIE));
    headers
}

pub async fn register(
    State(pg_pool): State<PgPool>,
    Json(user): Json<AuthReq>,
) -> Result<(StatusCode, HeaderMap, String), (StatusCode, String)> {
    // Create new user
    let _new_user = sqlx::query!(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        user.username,
        user.password
    )
    .execute(&pg_pool)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            json!({"success":false, "message":e.to_string()}).to_string(),
        )
    })?;

    // Set cookie now itself so that he won't have to login again to use the app
    let headers = cookie(user.username.as_str(), false);
    println!("New user registered",);
    Ok((
        StatusCode::OK,
        headers,
        json!({"success":true, "message":format!("Successfully resigtered new User,{}",user.username)}).to_string(),
    ))
}

pub async fn login(
    State(pg_pool): State<PgPool>,
    Json(credentials): Json<AuthReq>,
) -> Result<(StatusCode, HeaderMap, String), (StatusCode, String)> {
    // Check if user exists
    let user = sqlx::query!(
        "SELECT username, password FROM users WHERE username = $1",
        credentials.username
    )
    .fetch_optional(&pg_pool)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            json!({"success": false, "message": e.to_string()}).to_string(),
        )
    })?;

    // Validate credentials
    match user {
        Some(u) if u.password == credentials.password => {
            let headers = cookie(&u.username, false);
            Ok((
                StatusCode::OK,
                headers,
                json!({"success": true, "message": "Login successful"}).to_string(),
            ))
        }
        _ => Err((
            StatusCode::UNAUTHORIZED,
            json!({"success": false, "message": "Invalid credentials"}).to_string(),
        )),
    }
}

pub async fn logout() -> Result<(StatusCode, HeaderMap, String), (StatusCode, String)> {
    // Remove the session cookie, so he logs out automatically
    let headers = cookie("", true);
    Ok((
        StatusCode::OK,
        headers,
        json!({"success": true, "message": "Logged out"}).to_string(),
    ))
}

// Extract redundant logic b/w check_auth and auth_middleware
pub async fn check_auth(
    State(pool): State<PgPool>,
    req: axum::http::Request<axum::body::Body>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    // Extract username from cookie (using the same logic as auth_middleware)
    let username = req
        .headers()
        .get_all(axum::http::header::COOKIE)
        .iter()
        .filter_map(|c| c.to_str().ok())
        .find_map(|cookies| {
            cookies.split(';').find_map(|cookie| {
                let mut parts = cookie.trim().splitn(2, '=');
                match (parts.next(), parts.next()) {
                    (Some(key), Some(value)) if key == "session" => Some(value.to_string()),
                    _ => None,
                }
            })
        });

    let username = username.ok_or((
        StatusCode::UNAUTHORIZED,
        json!({"success": false, "message": "Please Login"}).to_string(),
    ))?;

    // Check if user exists in DB
    let exists = sqlx::query_scalar!(
        "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)",
        username
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            json!({"success": false, "message": e.to_string()}).to_string(),
        )
    })?
    .unwrap_or(false);

    if !exists {
        return Err((
            StatusCode::UNAUTHORIZED,
            json!({"success": false, "message": "Please Login"}).to_string(),
        ));
    }

    // Return the username if validation succeeds
    Ok((
        StatusCode::OK,
        json!({"success": true, "username": username}).to_string(),
    ))
}

pub async fn auth_middleware(
    State(pool): State<PgPool>,
    mut req: axum::http::Request<axum::body::Body>,
    next: Next,
) -> Result<axum::response::Response, (StatusCode, String)> {
    // Extract username from cookie (I chatGPTed I didn't have time)
    let username = req
        .headers()
        .get_all(axum::http::header::COOKIE)
        .iter()
        .filter_map(|c| c.to_str().ok())
        .find_map(|cookies| {
            cookies.split(';').find_map(|cookie| {
                let mut parts = cookie.trim().splitn(2, '=');
                match (parts.next(), parts.next()) {
                    (Some(key), Some(value)) if key == "session" => Some(value.to_string()),
                    _ => None,
                }
            })
        });

    let username = username.ok_or((
        StatusCode::UNAUTHORIZED,
        json!({"success": false, "message": "Please Login"}).to_string(),
    ))?;

    // Check if user exists in DB
    let exists = sqlx::query_scalar!(
        "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)",
        username
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            json!({"success": false, "message": e.to_string()}).to_string(),
        )
    })?
    .unwrap_or(false);

    if !exists {
        return Err((
            StatusCode::UNAUTHORIZED,
            json!({"success": false, "message": "Please Login"}).to_string(),
        ));
    }

    // Add username to request extensions
    req.extensions_mut().insert(username);
    Ok(next.run(req).await)
}
