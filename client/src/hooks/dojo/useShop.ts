import { useDojoSDK } from '@dojoengine/sdk/react';
import { useCallback } from 'react';
import { Account, AccountInterface, BigNumberish } from 'starknet';

/**
 * Custom React hook that provides methods to interact with the ShopCatalog client.
 *
 * Exposes functions to add/update shop items and query item details.
 *
 * @returns {Object} An object containing methods for managing shop items:
 * - `addNewItem(account, price, stock, description)`
 * - `updateItem(account, id, price, stock, description)`
 * - `getItem(id)`
 * - `getAllItems()`
 *
 * @example
 * const {
 *   addNewItem,
 *   getItem,
 *   updateItem
 * } = useShopCatalog();
 *
 * // Add a new shop item
 * const itemId = await addNewItem(account, 100, 50, "New decoration");
 *
 * // Fetch an item by ID
 * const item = await getItem(1);
 *
 * // Update an item
 * await updateItem(account, 1, 150, 40, "Updated decoration");
 */
export const useShopCatalog = () => {
  const { client } = useDojoSDK();

  /**
   * Adds a new item to the shop catalog.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} price - Item price.
   * @param {BigNumberish} stock - Item stock quantity.
   * @param {string} description - Item description.
   * @returns {Promise<BigNumberish>} The new item ID.
   */
  const addNewItem = useCallback(
    async (
      account: Account | AccountInterface,
      price: BigNumberish,
      stock: BigNumberish,
      description: string
    ) => {
      return await client.ShopCatalog.add_new_item(
        account,
        price,
        stock,
        description
      );
    },
    [client]
  );

  /**
   * Updates an existing item in the shop catalog.
   * @param {Account | AccountInterface} account - User account instance.
   * @param {BigNumberish} id - Item ID to update.
   * @param {BigNumberish} price - New price.
   * @param {BigNumberish} stock - New stock quantity.
   * @param {string} description - New description.
   * @returns {Promise<any>} Result of the transaction.
   */
  const updateItem = useCallback(
    async (
      account: Account | AccountInterface,
      id: BigNumberish,
      price: BigNumberish,
      stock: BigNumberish,
      description: string
    ) => {
      return await client.ShopCatalog.update_item(
        account,
        id,
        price,
        stock,
        description
      );
    },
    [client]
  );

  /**
   * Retrieves a shop item by its ID.
   * @param {BigNumberish} id - Item ID.
   * @returns {Promise<models.ShopItemModel>} Item data.
   */
  const getItem = useCallback(
    async (id: BigNumberish) => {
      return await client.ShopCatalog.get_item(id);
    },
    [client]
  );

  /**
   * Retrieves all shop items.
   * @returns {Promise<models.ShopItemModel[]>} Array of all item data.
   */
  const getAllItems = useCallback(async () => {
    return await client.ShopCatalog.get_all_items();
  }, [client]);

  return {
    addNewItem,
    updateItem,
    getItem,
    getAllItems,
  };
};
