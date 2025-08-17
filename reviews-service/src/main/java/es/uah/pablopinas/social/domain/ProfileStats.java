package es.uah.pablopinas.social.domain;

public record ProfileStats(
        long followers,
        long following,
        long reviews,
        long likesReceived,
        long publicLists
        ) {
}
