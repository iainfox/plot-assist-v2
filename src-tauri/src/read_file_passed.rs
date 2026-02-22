use std::env;

pub fn run() {
    let args: Vec<String> = env::args().collect();

    if args.len() > 1 {
        let file_path = &args[args.len() - 1];
        if file_path.contains('/') || file_path.contains('\\') || file_path.contains('.') {
            if std::path::Path::new(file_path).exists() {
                if let Ok(file) = std::fs::File::open(file_path) {
                    use std::io::{self, BufRead};
                    let mut reader = io::BufReader::new(file);

                    let names: Vec<String> = {
                        let mut line = String::new();
                        if let Ok(_) = reader.read_line(&mut line) {
                            line.trim_end().split(',').map(|s| s.to_string()).collect()
                        } else {
                            Vec::new()
                        }
                    };

                    let mut data: Vec<Vec<f32>> = Vec::new();
                    for line in reader.lines() {
                        if let Ok(content) = line {
                            let row: Vec<f32> = content
                                .split(',')
                                .filter_map(|s| s.trim().parse::<f32>().ok())
                                .collect();
                            data.push(row);
                        }
                    }
                    
                    #[cfg(debug_assertions)]
                    {
                        println!("{:?}", names);
                        for line in &data {
                            println!("{:?}", line);
                        }
                    }
                }
            }
        } else {
            for arg in args.iter().skip(1) {
                if std::path::Path::new(arg).exists() {}
            }
        }
    }
}
