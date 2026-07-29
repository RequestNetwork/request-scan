/** @format */

/**
 * This module used to hold a byte-for-byte duplicate of the payments query and
 * a `fetchPayments` that swallowed every error and returned `[]`, which made a
 * failed request indistinguishable from "no payments" at the query layer.
 *
 * It now re-exports the single implementation in `../queries/payments`, which
 * degrades to partial data when individual chains fail and propagates the error
 * when the whole request fails, so react-query reports `status === "error"`.
 */
export { buildPaymentsQuery, fetchPayments } from "../queries/payments";
