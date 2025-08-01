#[cfg(test)]
mod tests {
    use starknet::contract_address_const;
    use aqua_stark::models::fish_model::{TargetedTradeOffer, FishOwner, TradeOfferCounter};
    use aqua_stark::base::events::TradeOfferCreated;
    use aqua_stark::systems::AquaStark::AquaStark;
    use dojo::world::IWorldDispatcherTrait;
    use dojo::model::ModelStorage;

    fn zero_address() -> ContractAddress {
        contract_address_const::<0>()
    }

    #[test]
    fn test_trade_offer_struct_creation() {
        let trade_offer = TargetedTradeOffer {
            id: 1,
            creator: zero_address(),
            offered_fish_id: 100,
            requested_fish_id: 200,
            is_active: true,
        };

        assert(trade_offer.id == 1, 'Trade offer ID should match');
        assert(trade_offer.offered_fish_id == 100, 'Offered fish ID should match');
        assert(trade_offer.requested_fish_id == 200, 'Requested fish ID should match');
        assert(trade_offer.is_active == true, 'Trade offer should be active');
    }

    #[test]
    fn test_trade_offer_counter() {
        let counter = TradeOfferCounter {
            id: 'trade_offer_counter',
            current_val: 0,
        };

        assert(counter.id == 'trade_offer_counter', 'Counter ID should match');
        assert(counter.current_val == 0, 'Counter value should be 0');
    }

    #[test]
    fn test_trade_offer_created_event() {
        let event = TradeOfferCreated {
            offer_id: 1,
            creator: zero_address(),
            offered_fish_id: 100,
            requested_fish_id: 200,
            timestamp: 1234567890,
        };

        assert(event.offer_id == 1, 'Offer ID should match');
        assert(event.offered_fish_id == 100, 'Offered fish ID should match');
        assert(event.requested_fish_id == 200, 'Requested fish ID should match');
        assert(event.timestamp == 1234567890, 'Timestamp should match');
    }
}