use axum::{
    Router,
    middleware::from_fn_with_state,
    routing::{get, post, put},
};

use sqlx::postgres::PgPoolOptions;

// tokio for async rust code
use tokio::net::TcpListener;

mod todo;
mod user;
use todo::handlers::{create_todo, delete_todo, get_list, update_todo};
use user::handlers::{auth_middleware, login, logout, register};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().expect("Failed to parse .env file");

    // Defaulting to localhost:8080 if we don't get the server_address, but we panic and exit if db_url idn't found coz obviously
    let server_address = std::env::var("SERVER_ADDRESS").unwrap_or("127.0.0.1:8080".to_owned());
    let db_url = std::env::var("DB_URL").expect("Couldn't retrieve DB_URL from .env file");

    // Using a database_pool prevents reconnection to the DB for every request, and helps with concurrent requests to the server
    let db_pool = PgPoolOptions::new()
        .max_connections(16)
        .connect(&db_url)
        .await
        .expect("Couldn't connect to the database");

    // Maybe use a logger?
    println!("Connection to DB estabilished");

    let listener = TcpListener::bind(server_address)
        .await
        .expect("Couldn't create a TCP Listener");

    let router = Router::new()
        .route("/todo", get(get_list).post(create_todo))
        .route("/todo/{todo_id}", put(update_todo).delete(delete_todo))
        .layer(from_fn_with_state(db_pool.clone(), auth_middleware));

    let user_router = Router::new()
        .route("/users", post(register))
        .route("/logout", post(logout))
        .route("/login", post(login))
        .merge(router)
        .with_state(db_pool);

    println!("Listening on: {}", listener.local_addr().unwrap());
    axum::serve(listener, user_router)
        .await
        .expect("Couldn't start the server");
}
