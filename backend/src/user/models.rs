use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct AuthReq {
    pub username: String,
    pub password: String,
}
