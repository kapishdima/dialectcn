import {
  createLoader,
  createSerializer,
  parseAsStringLiteral,
} from "nuqs/server";
import { PRESET_SORTS, PRESET_VIEWS } from "@/lib/domain/source-labels";

export const feedFilterParsers = {
  source: parseAsStringLiteral(PRESET_VIEWS),
  sort: parseAsStringLiteral(PRESET_SORTS).withDefault("popular"),
};

export const serializeFeedFilters = createSerializer(feedFilterParsers);
export const loadFeedFilters = createLoader(feedFilterParsers);
