// Example: How to do basic Java-style class construction in Rust

// The Java code:
// public class ClassName {
//     private int var;
//     public ClassName(int var) {
//         this.var = var;
//     }
// }

// Here's how you'd do it in Rust:
#[derive(Clone)]
pub struct Channel {
    pub name: String,
    pub data: Vec<f32>,
}

pub struct ChannelSystem {
    groups: Vec<Vec<Channel>>,
}

impl ChannelSystem {
    pub fn new() -> ChannelSystem {
        ChannelSystem { groups: Vec::new() }
    }

    pub fn move_backward(&mut self, index: usize) {
        if self.groups.len() < 2 || index == 0 || index >= self.groups.len() {
            return;
        }
        self.groups.swap(index, index - 1);
    }

    pub fn move_forward(&mut self, index: usize) {
        let len = self.groups.len();
        if len < 2 || index + 1 >= len {
            return;
        }
        self.groups.swap(index, index + 1);
    }

    pub fn combine(&mut self, a: usize, b: usize) {
        let mut other = self.groups.remove(b);
        self.groups[a].append(&mut other);
    }
 
    pub fn add_channels(&mut self, channels: Vec<Channel>, grouped: bool) {
        if grouped {
            self.groups.push(channels);
        } else {
            for channel in channels {
                self.groups.push(vec![channel]);
            }
        }
    }
 
    pub fn remove_channels(&mut self, group_indices: Vec<usize>, channel_names: Vec<String>) {
        for &group_index in group_indices.iter() {
            if let Some(group) = self.groups.get_mut(group_index) {
                group.retain(|ch: &Channel| !channel_names.contains(&ch.name));
            }
        }
    }

    pub fn remove_all(&mut self) {
        self.groups.clear();
    }

    pub fn get_groups(&self) -> Vec<Vec<String>> {
        self.groups
            .iter()
            .map(|group| group.iter().map(|ch| ch.name.clone()).collect())
            .collect()
    }
}
