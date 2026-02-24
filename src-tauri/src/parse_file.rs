use std::env;

pub fn parse_file() -> Option<(Vec<String>, Vec<Vec<f32>>, Vec<String>)> {
    let file_path = env::args().last().unwrap_or_default();
    if !std::path::Path::new(&file_path).exists() {
        return None;
    }

    let file = std::fs::File::open(file_path).ok()?;
    use std::io::{self, BufRead};

    let mut reader = io::BufReader::new(file);

    let mut first_line = String::new();
    reader.read_line(&mut first_line).ok()?;

    let names: Vec<String> = first_line
        .trim_end()
        .split(',')
        .map(|s| s.to_string())
        .collect();

    let mut data: Vec<Vec<f32>> = Vec::new();
    let mut idx: Vec<String> = Vec::new();

    for line in reader.lines().flatten() {
        let row: Vec<f32> = line
            .split(',')
            .filter_map(|s| s.trim().parse::<f32>().ok())
            .collect();
        idx.push(row[0].to_string());
        data.push(row[1..].to_vec());
    }

    Some((names[1..].to_vec(), data, idx))
}