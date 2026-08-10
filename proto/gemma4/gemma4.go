package gemma4

type Experience struct {
	Type         string `json:"type"`
	Source       string `json:"source"`
	Content      string `json:"content"`
	MetadataJson string `json:"metadata_json"`
}

type ExperienceBatch struct {
	BatchId     string        `json:"batch_id"`
	Experiences []*Experience `json:"experiences"`
}

type ExperienceAck struct {
	Success        bool   `json:"success"`
	ProcessedCount int32  `json:"processed_count"`
}
