import { createSerializer, parseAsStringLiteral } from "nuqs";
import { PRESET_SORTS, PRESET_SOURCES } from "@/lib/domain/source-labels";

export const feedFilterParsers = {
  source: parseAsStringLiteral(PRESET_SOURCES),
  sort: parseAsStringLiteral(PRESET_SORTS).withDefault("popular"),
};

export const serializeFeedFilters = createSerializer(feedFilterParsers);
