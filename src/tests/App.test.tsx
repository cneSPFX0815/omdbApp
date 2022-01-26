import { OmdbApi } from '../api/OmdbApi';


test('Test api', async () => {
  let result1 = await OmdbApi.search("", 1);
  let result2 = await OmdbApi.search("ABC", -1);
  let result3 = await OmdbApi.search("ABC", 99);
  let result4 = await OmdbApi.search("A$%B", 1);
});
