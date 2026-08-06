const supabase = require("./supabase");
const { syncToNotion } = require("./notionSync");


async function addWord(data) {

  const { data: existing, error: findError } = await supabase
    .from("words")
    .select("*")
    .ilike("word", data.word)
    .maybeSingle();

  if (findError) {
    console.error("❌ supabase sorgu hatası:", findError.message);
    return { isDuplicate: false, count: 1, error: true };
  }

  if (existing) {

    const newCount = (existing.times || 1) + 1;

    const existingSources = existing.source || [];
    const newSources =
      data.source && !existingSources.includes(data.source)
        ? [...existingSources, data.source]
        : existingSources;

    const newHistory = [...(existing.history || []), data.date];

    const { error: updateError } = await supabase
      .from("words")
      .update({
        times: newCount,
        date: data.date,
        source: newSources,
        history: newHistory,
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("❌ supabase güncelleme hatası:", updateError.message);
      return { isDuplicate: false, count: 1, error: true };
    }

    console.log(`🔁 ${data.word} zaten vardı, x${newCount} yapıldı.`);

    // notion senkronunu bekletmeden arka planda yürüt
    syncToNotion(data, newCount);

    return { isDuplicate: true, count: newCount };
  }

  const { error: insertError } = await supabase.from("words").insert({
    word: data.word,
    meaning: data.meaning,
    example: data.example,
    notes: data.notes,
    pronunciation: data.pronunciation,
    type: data.type,
    level: data.level,
    source: data.source ? [data.source] : [],
    language: data.language || "🇺🇸",
    times: 1,
    date: data.date,
    first_seen: data.date,
    history: [data.date],
  });

  if (insertError) {
    console.error("❌ supabase ekleme hatası:", insertError.message);
    return { isDuplicate: false, count: 1, error: true };
  }

  console.log(`✅ ${data.word} eklendi!`);

  syncToNotion(data, 1);

  return { isDuplicate: false, count: 1 };
}


async function getAllWords() {

  const { data, error } = await supabase
    .from("words")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("❌ supabase listeleme hatası:", error.message);
    return [];
  }

  return data.map((row) => ({
    word: row.word,
    meaning: row.meaning,
    example: row.example,
    notes: row.notes,
    pronunciation: row.pronunciation,
    type: row.type,
    level: row.level,
    source: row.source,
    date: row.date,
    firstSeen: row.first_seen,
    history: row.history || [],
    count: row.times,
  }));
}


module.exports = { addWord, getAllWords };