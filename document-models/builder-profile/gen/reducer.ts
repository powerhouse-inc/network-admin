// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { BuilderProfilePHState } from "./ph-factories.js";
import { z } from "./types.js";

import { reducer as BuilderReducer } from "../src/reducers/builder.js";

export const stateReducer: StateReducer<BuilderProfilePHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "UPDATE_PROFILE":
      z.UpdateProfileInputSchema().parse(action.input);
      BuilderReducer.updateProfileOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<BuilderProfilePHState>(stateReducer);
