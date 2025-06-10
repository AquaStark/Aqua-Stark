use dojo::world::WorldStorage;
pub fn world_default_w(self: ContractState) -> WorldStorage {
    self.world(@"aqua_stark_od")
}
