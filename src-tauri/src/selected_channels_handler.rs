// Example: How to do basic Java-style class construction in Rust

// The Java code:
// public class ClassName {
//     private int var;
//     public ClassName(int var) {
//         this.var = var;
//     }
// }

// Here's how you'd do it in Rust:

pub struct Channel {
    name: String,
    data: Vec<f32>,
}

struct ChannelGroup {
    channels: Vec<Channel>,
}

struct ChannelSystem {
    groups: Vec<ChannelGroup>,
}

impl ChannelSystem {
    pub fn new() -> ChannelSystem {
        ChannelSystem { groups: Vec::new() }
    }

    pub fn move_backward(&mut self, index: usize) {
        let len = self.groups.len();
        if len < 2 {
            return;
        }

        let prev = (len + index - 1) % len;
        self.groups.swap(index, prev);
    }

    pub fn move_forward(&mut self, index: usize) {
        let len = self.groups.len();
        if len < 2 {
            return;
        }

        let next = (index + 1) % len;
        self.groups.swap(index, next);
    }

    pub fn combine(&mut self, a: usize, b: usize) {
        let mut other = self.groups.remove(b);
        self.groups[a].channels.append(&mut other.channels);
    }
 
    pub fn add_channels(&mut self, channels: Vec<Channel>, grouped: bool) {
        if grouped {
            self.groups.push(ChannelGroup { channels });
        } else {
            for channel in channels {
                self.groups.push(ChannelGroup { channels: vec![channel] });
            }
        }
    }
 
    pub fn remove_channels(&mut self, group_indices: &[usize], channel_names: &[String]) {
        for &group_index in group_indices.iter() {
            if let Some(group) = self.groups.get_mut(group_index) {
                group.channels.retain(|ch: &Channel| !channel_names.contains(&ch.name));
            }
        }
    }

    pub fn remove_all(&mut self) {
        self.groups.clear();
    }
}
