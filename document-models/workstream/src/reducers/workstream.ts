/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { WorkstreamWorkstreamOperations } from "../../gen/workstream/operations.js";

export const reducer: WorkstreamWorkstreamOperations = {
  editWorkstreamOperation(state, action, dispatch) {
    const input = action.input;
    
    // Update workstream fields if provided
    if (input.code !== undefined) {
      state.code = input.code || null;
    }
    if (input.title !== undefined) {
      state.title = input.title || null;
    }
    if (input.status !== undefined) {
      state.status = input.status || "RFP_DRAFT";
    }
    if (input.sowId !== undefined) {
      state.sow = input.sowId || null;
    }
    if (input.paymentTerms !== undefined) {
      state.paymentTerms = input.paymentTerms || null;
    }
  },

  editClientInfoOperation(state, action, dispatch) {
    const input = action.input;
    
    // Create or update client info
    if (!state.client) {
      state.client = {
        id: input.clientId,
        name: null,
        icon: null,
      };
    }
    
    // Update client ID (required field)
    state.client.id = input.clientId;
    
    // Update optional fields if provided
    if (input.name !== undefined) {
      state.client.name = input.name || null;
    }
    if (input.icon !== undefined) {
      state.client.icon = input.icon || null;
    }
  },

  setRequestForProposalOperation(state, action, dispatch) {
    const input = action.input;
    
    // Create or update RFP
    state.rfp = {
      id: input.rfpId,
      title: input.title,
    };
  },

  addPaymentRequestOperation(state, action, dispatch) {
    const input = action.input;
    
    // Add payment request ID if not already present
    if (!state.paymentRequests.includes(input.id)) {
      state.paymentRequests.push(input.id);
    }
  },

  removePaymentRequestOperation(state, action, dispatch) {
    const input = action.input;
    
    // Remove payment request ID from the array
    const index = state.paymentRequests.indexOf(input.id);
    if (index > -1) {
      state.paymentRequests.splice(index, 1);
    }
  },
};
